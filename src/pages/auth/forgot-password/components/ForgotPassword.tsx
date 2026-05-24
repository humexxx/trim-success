import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCircle2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export interface ForgotPasswordFormInputs {
  email: string;
}

export interface ForgotPasswordProps {
  handleOnSubmit: (form: ForgotPasswordFormInputs) => Promise<void>;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de email inválido")
    .required("Email requerido"),
});

export default function ForgotPassword({
  handleOnSubmit,
}: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await handleOnSubmit(data);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Recupera tu contraseña</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Te enviaremos un email con un enlace para restablecerla
          </p>
        </div>

        {success ? (
          <Alert>
            <CheckCircle2 />
            <AlertDescription>
              Si existe una cuenta con ese email, recibirás un mensaje en breve
              con las instrucciones.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="grid gap-4"
            >
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

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" loading={isLoading}>
                Enviar email de recuperación
              </Button>
            </form>
          </Form>
        )}

        <div className="flex flex-col items-center gap-2 text-center text-sm">
          <Link to="/login" className="underline underline-offset-4">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
