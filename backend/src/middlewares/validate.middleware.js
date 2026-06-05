const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
});

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignedUserId: z.number().int().positive().nullable().optional(),
  teamId: z.number().int().positive(),
});

function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = new Error(result.error.errors.map((e) => e.message).join(", "));
      err.status = 400;
      return next(err);
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validate, registerSchema, loginSchema, createTeamSchema, createTaskSchema };
