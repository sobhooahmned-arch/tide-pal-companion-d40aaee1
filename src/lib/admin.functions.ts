import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ id: z.string().max(200), name: z.string().max(200), pw: z.string().max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const n = (v: string) => v.trim().toLowerCase();
    const ok =
      n(data.id) === n(process.env["ADMIN_LOGIN_ID"] ?? "\u0000") &&
      n(data.name) === n(process.env["ADMIN_LOGIN_NAME"] ?? "\u0000") &&
      data.pw === (process.env["ADMIN_LOGIN_PASSWORD"] ?? "\u0000");
    await new Promise((r) => setTimeout(r, 400));
    return { ok };
  });
