# Estrategia de Prueba: Transferencia Automática de Fondos (MYM-27)

> **Objetivo:** Validar que el sistema procesa automáticamente las transferencias de fondos a los mentores 24 horas después de completada una sesión.

Debido a restricciones en el entorno de Staging (imposibilidad de manipular el reloj del servidor o disparar Cron Jobs de Vercel directamente sin permisos de admin), esta prueba utiliza una estrategia de **"Viaje en el Tiempo por Base de Datos"** (Data Seeding con timestamps pasados).

---

## 1. Requisitos Previos

*   Acceso a la Base de Datos de Staging (Supabase SQL Editor o cliente como DBeaver).
*   Herramienta para peticiones HTTP (Curl, Postman) o colaboración de un Desarrollador.
*   **Mentor de Prueba:** `mentor.jlb984@mailinator.com` (ID: `0166943d-fec8-41ac-94a0-6a1ed823074f`)
    *   *Nota:* Este mentor ya tiene cuenta Stripe Connect configurada (`payouts_enabled: true`).
*   **Mentee de Prueba:** `mentee.jlb984@mailinator.com`

---

## 2. Preparación de Datos (SQL Injection)

Para simular una sesión que "ya pasó hace 24 horas", inyectaremos registros directamente en la base de datos usando SQL.

### Paso 2.1: Obtener ID del Mentee
Ejecutar en BD para confirmar el ID del mentee:
```sql
SELECT id FROM profiles WHERE email = 'mentee.jlb984@mailinator.com';
-- Resultado esperado: Un UUID (ej: '5e6f7a8b-...')
```

### Paso 2.2: Insertar Reserva "Elegible" y Transacción
Este script crea una sesión que se completó hace **25 horas**, cumpliendo el criterio de elegibilidad (>24h).

**Instrucciones:** Reemplaza `[MENTEE_ID]` con el UUID obtenido en el paso anterior.

```sql
BEGIN;

-- 1. Insertar Reserva (Booking) completada hace 25 horas
WITH new_booking AS (
  INSERT INTO bookings (
    mentor_id,
    student_id,
    session_date,
    duration_minutes,
    total_cost,
    status,
    completed_at,      -- CLAVE: Fecha en el pasado
    created_at,
    updated_at
  )
  VALUES (
    '0166943d-fec8-41ac-94a0-6a1ed823074f', -- ID del Mentor (JLB Mentor Test)
    '[MENTEE_ID]',                          -- ID del Mentee (REEMPLAZAR AQUI)
    NOW() - interval '26 hours',            -- Fecha de sesión
    60,                                     -- Duración
    50.00,                                  -- Costo Total
    'completed',                            -- Estado requerido
    NOW() - interval '25 hours',            -- Completada hace > 24h
    NOW() - interval '2 days',
    NOW() - interval '25 hours'
  )
  RETURNING id
)
-- 2. Insertar Transacción asociada (simulando pago exitoso previo)
INSERT INTO transactions (
  booking_id,
  student_id,
  mentor_id,
  amount,
  platform_fee,
  net_amount,
  currency,
  status,
  stripe_payment_intent_id,
  created_at
)
SELECT
  id,
  '[MENTEE_ID]',                            -- ID del Mentee (REEMPLAZAR AQUI)
  '0166943d-fec8-41ac-94a0-6a1ed823074f',   -- ID del Mentor
  50.00,                                    -- Monto Bruto
  7.50,                                     -- Fee (15%)
  42.50,                                    -- Neto para Mentor
  'usd',
  'succeeded',                              -- Estado requerido
  'pi_mock_manual_' || floor(random() * 1000000)::text,
  NOW() - interval '26 hours'
FROM new_booking;

COMMIT;
```

---

## 3. Ejecución de la Prueba (Trigger)

El Cron Job corre automáticamente a las 00:00 UTC. Para forzar la prueba **ahora**, invocaremos el endpoint manualmente.

### Opción A: Disparo vía Curl (Si tienes CRON_SECRET)
Si el desarrollador te proporciona el `CRON_SECRET` de Staging:

```bash
curl -X POST https://staging-upexmymentor.vercel.app/api/cron/process-payouts \
  -H "Authorization: Bearer [PEGAR_CRON_SECRET_AQUI]"
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "summary": {
    "eligible_count": 1,
    "processed_count": 1,
    "success_count": 1,
    "failed_count": 0
    ...
  }
}
```

### Opción B: Ejecución por Desarrollo
Si no tienes acceso al secret, solicita a un desarrollador que ejecute el endpoint o verifique los logs de Vercel después de la hora programada.

---

## 4. Verificación de Resultados

Una vez ejecutado el proceso, validar que el pago se haya registrado.

### Validación SQL (Base de Datos)
Ejecutar:

```sql
SELECT 
  p.id as payout_id,
  p.status as payout_status,
  p.amount,
  p.stripe_transfer_id,
  pi.transaction_id,
  p.created_at
FROM payouts p
JOIN payout_items pi ON p.id = pi.payout_id
WHERE p.mentor_id = '0166943d-fec8-41ac-94a0-6a1ed823074f'
ORDER BY p.created_at DESC
LIMIT 1;
```

**Criterios de Aceptación:**
1.  **Registro encontrado:** La consulta debe devolver 1 fila creada hace instantes.
2.  **Monto:** `amount` debe ser **42.50** (50.00 menos 15%).
3.  **Estado:** `payout_status` debe ser `pending` (o `paid`).
4.  **Transferencia:** `stripe_transfer_id` debe existir (formato `tr_...`).

### Validación en Dashboard (Opcional)
Si la UI de "Pagos" del mentor ya está implementada y funcional:
1.  Login como `mentor.jlb984@mailinator.com`.
2.  Ir a Dashboard > Pagos.
3.  Verificar si el saldo o historial refleja la transferencia de **$42.50**.

---

## 5. Rollback (Limpieza)

Para mantener el entorno limpio, elimina los datos de prueba al finalizar:

```sql
-- Borrar la transacción de prueba (el borrado en cascada debería limpiar booking y payouts si está configurado, sino borrar manualmente)
DELETE FROM transactions WHERE stripe_payment_intent_id LIKE 'pi_mock_manual_%';

-- Si no hay cascada, borrar booking explícitamente usando el ID que generaste (buscarlo primero)
-- DELETE FROM bookings WHERE id = '[ID_DEL_BOOKING_CREADO]';
```

---
---

# OPCIÓN 2: Estrategia de Prueba 100% Manual (Black Box)

> **Objetivo:** Validar el flujo completo desde la perspectiva del usuario final, sin accesos técnicos, aceptando el tiempo de espera natural del sistema (24h + ciclo de cron).

## 1. Requisitos Previos

*   **Cuenta de Mentee:** `mentee.jlb984@mailinator.com` con saldo o tarjeta de prueba.
*   **Cuenta de Mentor:** `mentor.jlb984@mailinator.com` con Stripe configurado.
*   **Ambiente:** Staging (donde el Cron Job esté activo).
*   **Bloqueos Conocidos:** Esta prueba requiere que el Bug **MYM-122** (Reserva bloqueada por pagos) esté resuelto.

## 2. Ejecución de la Prueba (Paso a Paso)

### Fase A: Creación de la Reserva (Día 1)
1.  Iniciar sesión como **Mentee**.
2.  Navegar a la página de **Explorar Mentores**.
3.  Seleccionar al mentor `JLB Mentor Test`.
4.  Agendar una sesión para el horario más cercano posible (ej: dentro de 1 hora).
5.  Seleccionar el canal de comunicación y proceder al pago.
6.  Completar el pago en la pasarela de Stripe (usar tarjeta de prueba `4242...`).
7.  **Verificación:** Confirmar que la reserva aparece como "Programada" en el dashboard.

### Fase B: Finalización de la Sesión (Día 1)
1.  Esperar a que transcurra el tiempo de la sesión agendada.
2.  Asegurarse de que la sesión pase a estado **"Completada"**.
    *   *Nota:* Si el sistema requiere confirmación manual, el Mentor o el Mentee deben marcarla como completada.
3.  **Verificación:** Confirmar en el Dashboard de Sesiones que aparece en la pestaña "Pasadas" como **Completada**.
4.  **Referencia Temporal (T0):** Anotar la hora exacta de finalización (ej: Lunes 14:00).

### Fase C: Período de Espera (Día 2)
1.  Esperar **24 horas** exactas desde *T0*.
    *   *Importante:* No realizar ninguna acción sobre la reserva durante este tiempo.
2.  **Verificación Negativa:** Entrar al Dashboard del Mentor a las 12 horas y validar que el dinero **AÚN NO** ha sido transferido.

### Fase D: Ejecución del Cron y Validación Final (Día 3)
1.  El sistema ejecuta el Cron Job automáticamente (usualmente a medianoche UTC).
2.  Una vez pasada la ejecución programada *posterior* a las 24 horas de espera:
3.  Iniciar sesión como **Mentor**.
4.  Navegar a **Dashboard > Pagos** (o Payouts).
5.  **Validación:**
    *   [ ] Buscar una nueva entrada en el historial de pagos.
    *   [ ] El monto debe ser el neto acordado ($50.00 - comisión).
    *   [ ] El estado debe ser "Pendiente", "En proceso" o "Pagado".

## 3. Resultado Esperado
El mentor recibe la transferencia automática sin intervención manual del administrador ni de los usuarios, exactamente después del período de gracia de 24 horas y en el siguiente ciclo de ejecución del cron.

## 4. Reporte de Fallos
Si pasadas 48 horas desde la finalización de la sesión el pago no aparece en el Dashboard del Mentor, se debe reportar como un fallo crítico en la automatización de pagos.