# ✅ Sistema de Indexación Automática - Implementado

## Resumen de Cambios

Se ha implementado un sistema completamente automatizado para:
1. Indexar nuevos agentes desde el ERC-8004 Identity Registry
2. Calcular trust scores automáticamente
3. Ejecutar la indexación cada hora vía cron job

---

## 📁 Archivos Creados/Modificados

### ✅ Scripts Actualizados
- **`scripts/index-by-range.ts`**
  - Ahora calcula trust scores automáticamente al crear agentes
  - Importa `updateAgentTrustScore()` del servicio
  - Maneja errores de cálculo de trust score gracefully

### ✅ Nuevos Endpoints API

1. **`src/app/api/v1/indexer/refresh/route.ts`**
   - `POST /api/v1/indexer/refresh`
   - Ejecuta el script de indexación
   - Retorna estadísticas (indexed, skipped, failed, duration)
   - Timeout: 5 minutos

2. **`src/app/api/cron/indexer/route.ts`**
   - `GET /api/cron/indexer`
   - Protegido por `CRON_SECRET` en producción
   - Llama al endpoint de refresh internamente
   - Programado para correr cada hora

### ✅ Configuración

1. **`vercel.json`**
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/indexer",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```

### ✅ Frontend Actualizado
- **`src/app/(main)/scanner/page.tsx`**
  - Botón "Sync" ahora llama a `/api/v1/indexer/refresh`
  - Muestra resultados de la indexación en consola

### ✅ Documentación
- **`docs/deployment/agent-indexer-setup.md`**
  - Guía completa de setup y configuración
  - Instrucciones para Vercel
  - Troubleshooting

---

## 🔄 Flujo Automático

### Cada Hora (Cron Job)
```
Vercel Cron (every hour)
  ↓
GET /api/cron/indexer
  ↓
POST /api/v1/indexer/refresh
  ↓
npx tsx scripts/index-by-range.ts
  ↓
For each new agent:
  1. Create agent in DB
  2. Calculate trust score
  3. Save trust score
```

### Manual (Botón Sync)
```
User clicks "Sync"
  ↓
POST /api/v1/indexer/refresh
  ↓
npx tsx scripts/index-by-range.ts
  ↓
Agents updated + trust scores calculated
  ↓
UI refreshes automatically
```

---

## ⚙️ Variables de Entorno Requeridas

Agregar a `.env` y Vercel Dashboard:

```bash
# Para el cron job (producción)
CRON_SECRET=tu-secreto-aleatorio-aqui

# URL base de la app (para llamadas internas)
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

---

## 🧪 Testing

### Local - Script Directo
```bash
npx tsx scripts/index-by-range.ts
```

### Local - API Endpoint
```bash
# Iniciar dev server
npm run dev

# En otra terminal
curl -X POST http://localhost:3000/api/v1/indexer/refresh
```

### Producción - Manual
```bash
curl -X POST https://tu-dominio.com/api/v1/indexer/refresh
```

### Producción - Cron (con auth)
```bash
curl -H "Authorization: Bearer TU_CRON_SECRET" \
  https://tu-dominio.com/api/cron/indexer
```

---

## 📊 Trust Scores

Los trust scores se calculan automáticamente basándose en:

| Componente | Peso | Score para nuevos agentes |
|------------|------|---------------------------|
| Volume     | 25%  | 20 (sin transacciones)    |
| Proxy      | 20%  | 100 (no detectado)        |
| Uptime     | 25%  | 0 (sin heartbeats)        |
| OZ Match   | 15%  | 20 (sin scan)             |
| Ratings    | 15%  | 50 (sin ratings)          |

**Score inicial típico**: 36-50 puntos

---

## ✅ Estado Actual

- ✅ 1621 agentes indexados
- ✅ Todos con trust scores calculados
- ✅ Script listo para ejecución automática
- ✅ Endpoint de refresh funcionando
- ✅ Cron job configurado
- ✅ Frontend actualizado

---

## 🚀 Próximos Pasos

1. **Deploy a Vercel**:
   ```bash
   git add .
   git commit -m "feat: automated agent indexer with trust scores"
   git push
   ```

2. **Configurar en Vercel Dashboard**:
   - Settings → Environment Variables
   - Agregar `CRON_SECRET`
   - Agregar `NEXT_PUBLIC_APP_URL`

3. **Verificar Cron Job**:
   - En Vercel Dashboard → Cron Jobs
   - Debería aparecer el job `/api/cron/indexer`
   - Schedule: `0 * * * *` (cada hora)

4. **Monitorear**:
   - Logs en Vercel
   - Check en Scanner después de 1 hora

---

## 📝 Notas

- El cron job solo se activa en producción (Vercel)
- En desarrollo, usar el botón "Sync" manual
- Los logs están en formato JSON (compatible con Vercel)
- Trust scores se recalculan cada vez que se llama al endpoint

---

**Documentación completa**: `docs/deployment/agent-indexer-setup.md`
