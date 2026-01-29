---
name: synscale-api-generator
description: Generate complete RESTful API endpoints for SynScale services including routes, controllers, validation, error handling, and OpenAPI documentation. Works for Node.js, Python FastAPI, and Go Gin.
invocation: Use when user mentions "create API", "generate endpoints", "REST API", "API routes", "add endpoint"
fork: subagent
---

# SynScale API Generator Skill

## Purpose
Automatically generate production-ready API endpoints with proper structure, validation, error handling, authentication, and documentation.

## Supported Patterns

### 1. CRUD Operations
Standard Create, Read, Update, Delete for resources.

### 2. Smart Rights Evaluation
Special endpoints for rights checking and rule execution.

### 3. AI Proxy
Token-counted API calls with metering.

### 4. Nested Resources
Parent-child relationships (e.g., /arks/:id/assets).

## Instructions

### Node.js/Express API Generation

When user requests "Create API for Arks":

1. **Create Route File**
   `services/api-gateway/src/routes/arks.ts`:
   ```typescript
   import { Router } from 'express';
   import { ArkController } from '../controllers/ArkController';
   import { authMiddleware } from '../middleware/auth';
   import { validateArk } from '../middleware/validation';

   const router = Router();

   // GET /api/arks - List all arks
   router.get('/', authMiddleware, ArkController.list);

   // GET /api/arks/:id - Get single ark
   router.get('/:id', authMiddleware, ArkController.getById);

   // POST /api/arks - Create new ark
   router.post('/', authMiddleware, validateArk, ArkController.create);

   // PATCH /api/arks/:id - Update ark
   router.patch('/:id', authMiddleware, validateArk, ArkController.update);

   // DELETE /api/arks/:id - Delete ark
   router.delete('/:id', authMiddleware, ArkController.delete);

   // GET /api/arks/:id/balance - Get ark balance
   router.get('/:id/balance', authMiddleware, ArkController.getBalance);

   export default router;
   ```

2. **Create Controller**
   `services/api-gateway/src/controllers/ArkController.ts`:
   ```typescript
   import { Request, Response } from 'express';
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   export class ArkController {
     static async list(req: Request, res: Response) {
       try {
         const arks = await prisma.ark.findMany({
           where: { ownerId: req.user.id }
         });
         res.json(arks);
       } catch (error) {
         res.status(500).json({ error: 'Failed to fetch arks' });
       }
     }

     static async getById(req: Request, res: Response) {
       try {
         const ark = await prisma.ark.findUnique({
           where: { arkId: req.params.id }
         });
         if (!ark) return res.status(404).json({ error: 'Ark not found' });
         res.json(ark);
       } catch (error) {
         res.status(500).json({ error: 'Failed to fetch ark' });
       }
     }

     static async create(req: Request, res: Response) {
       try {
         const ark = await prisma.ark.create({
           data: {
             ownerId: req.user.id,
             arkType: req.body.arkType || 'personal',
             metadata: req.body.metadata || {}
           }
         });
         res.status(201).json(ark);
       } catch (error) {
         res.status(500).json({ error: 'Failed to create ark' });
       }
     }

     // ... more methods
   }
   ```

3. **Create Validation Middleware**
   `services/api-gateway/src/middleware/validation.ts`:
   ```typescript
   import { body, validationResult } from 'express-validator';

   export const validateArk = [
     body('arkType').optional().isIn(['personal', 'team', 'distributor']),
     body('metadata').optional().isObject(),
     (req, res, next) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
       next();
     }
   ];
   ```

4. **Register Routes**
   Update `services/api-gateway/src/index.ts`:
   ```typescript
   import arkRoutes from './routes/arks';
   app.use('/api/arks', arkRoutes);
   ```

### Python/FastAPI API Generation

When user requests "Create FastAPI endpoint for AI proxy":

1. **Create Router**
   `services/ai-proxy/app/routers/chat.py`:
   ```python
   from fastapi import APIRouter, HTTPException, Depends
   from pydantic import BaseModel
   import openai

   router = APIRouter(prefix="/api/chat", tags=["chat"])

   class ChatRequest(BaseModel):
       model: str = "gpt-3.5-turbo"
       messages: list[dict]
       ark_id: str

   @router.post("/")
   async def chat(request: ChatRequest):
       # Verify ark has balance
       balance = await check_ark_balance(request.ark_id)
       if balance <= 0:
           raise HTTPException(status_code=402, detail="Insufficient credits")

       # Call OpenAI
       response = openai.chat.completions.create(
           model=request.model,
           messages=request.messages
       )

       # Deduct tokens
       await deduct_tokens(request.ark_id, response.usage.total_tokens)

       return {
           "response": response.choices[0].message.content,
           "usage": response.usage.model_dump()
       }
   ```

2. **Register Router**
   `services/ai-proxy/app/main.py`:
   ```python
   from fastapi import FastAPI
   from .routers import chat

   app = FastAPI(title="SynScale AI Proxy")
   app.include_router(chat.router)
   ```

### Go/Gin API Generation

When user requests "Create Go API for rights evaluation":

1. **Create Handler**
   `services/rights-engine/pkg/api/handlers.go`:
   ```go
   package api

   import (
       "github.com/gin-gonic/gin"
       "net/http"
   )

   type RightsHandler struct {
       engine *RightsEngine
   }

   func (h *RightsHandler) EvaluateRule(c *gin.Context) {
       var req struct {
           RuleID   string  `json:"rule_id" binding:"required"`
           ArkID    string  `json:"ark_id" binding:"required"`
           Amount   float64 `json:"amount" binding:"required"`
       }

       if err := c.ShouldBindJSON(&req); err != nil {
           c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
           return
       }

       result, err := h.engine.Evaluate(req.RuleID, req.ArkID, req.Amount)
       if err != nil {
           c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
           return
       }

       c.JSON(http.StatusOK, result)
   }
   ```

2. **Register Routes**
   ```go
   func SetupRoutes(r *gin.Engine, handler *RightsHandler) {
       api := r.Group("/api/rights")
       {
           api.POST("/evaluate", handler.EvaluateRule)
           api.GET("/templates", handler.ListTemplates)
           api.POST("/templates", handler.CreateTemplate)
       }
   }
   ```

## Example Usage

**User**: "Create CRUD API for Arks in the API Gateway"

**Actions**:
1. Generate routes file
2. Generate controller with all CRUD methods
3. Create validation middleware
4. Register routes in main app
5. Show curl examples for testing

**User**: "Add an endpoint to check ark balance"

**Actions**:
1. Add route: `GET /api/arks/:id/balance`
2. Add controller method
3. Update OpenAPI spec

**User**: "Create API for AI chat with token counting"

**Actions**:
1. Generate FastAPI router
2. Implement token deduction logic
3. Add balance verification
4. Create Pydantic models

## OpenAPI Documentation

Auto-generate Swagger/OpenAPI docs:

```typescript
/**
 * @swagger
 * /api/arks:
 *   get:
 *     summary: List all arks
 *     tags: [Arks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of arks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ark'
 */
```

## Testing

Generate test cases:

```typescript
describe('Ark API', () => {
  it('should create a new ark', async () => {
    const response = await request(app)
      .post('/api/arks')
      .send({ arkType: 'personal' })
      .expect(201);

    expect(response.body).toHaveProperty('arkId');
  });
});
```

## Success Criteria

- All routes created and registered
- Controllers implement proper error handling
- Validation middleware in place
- Authentication/authorization working
- OpenAPI documentation generated
- Test cases provided

## Follow-up Suggestions

1. "Should I add rate limiting to these endpoints?"
2. "Want me to generate integration tests?"
3. "Ready to create the frontend API client?"
