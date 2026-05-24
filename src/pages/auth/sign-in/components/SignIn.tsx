import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { ShieldCheck, User2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { DEV_ACCOUNTS } from "src/lib/consts";
import * as yup from "yup";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icon for each dev account, matched by label. Kept local because
// importing JSX into a constants file would force everyone importing
// consts.ts to pay the lucide cost.
const DEV_ACCOUNT_ICONS: Record<string, typeof User2> = {
  Demo: User2,
  Admin: ShieldCheck,
};

export interface SignInFormInputs {
  email: string;
  password: string;
  persist: boolean;
}

export interface SignInProps {
  handleOnSubmit: (form: SignInFormInputs) => Promise<void>;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("Email requerido"),
  password: yup.string().required("Contraseña requerida"),
  persist: yup.boolean().default(false),
});

export default function SignIn({ handleOnSubmit }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignInFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", persist: false },
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await handleOnSubmit(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLogin = async (account: (typeof DEV_ACCOUNTS)[number]) => {
    await onSubmit({
      email: account.email,
      password: account.password,
      persist: true,
    });
  };

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Inicia sesión</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Ingresa tu email para acceder a tu cuenta
            </p>
          </div>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Contraseña</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="persist"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="persist"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label htmlFor="persist" className="cursor-pointer font-normal">
                    Mantener sesión iniciada
                  </Label>
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              Entrar
            </Button>
          </div>
        </form>
      </Form>

      {import.meta.env.DEV && (
        <div className="mt-6 space-y-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-background px-2 text-muted-foreground">
                Solo en dev
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DEV_ACCOUNTS.map((acc) => {
              const Icon = DEV_ACCOUNT_ICONS[acc.label] ?? User2;
              return (
                <Button
                  key={acc.email}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDevLogin(acc)}
                  disabled={isLoading}
                >
                  <Icon />
                  Entrar como {acc.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
