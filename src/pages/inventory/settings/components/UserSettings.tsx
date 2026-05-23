import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, UserCircle2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { PhoneField } from "src/components/form";
import { useAuth } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";
import { firestore } from "src/lib/firebase";
import * as yup from "yup";

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
import { Textarea } from "@/components/ui/textarea";

const schema = yup.object().shape({
  name: yup.string().required("Nombre requerido"),
  phone: yup.string().required("Teléfono requerido"),
  description: yup.string().required("Descripción requerida"),
});

interface FormInputs {
  name: string;
  phone: string;
  description: string;
}

export default function UserPage() {
  useDocumentMetadata("Usuario - Trim Success");
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", phone: "", description: "" },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const docRef = doc(firestore, "users", user.currentUser!.uid);
      await setDoc(docRef, data, { merge: true });
      alert("Datos guardados correctamente");
    } catch (error) {
      console.error("Error guardando los datos: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      const docRef = doc(firestore, "users", user.currentUser!.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FormInputs;
        form.setValue("name", data.name);
        form.setValue("phone", data.phone);
        form.setValue("description", data.description);
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [form, user.currentUser]);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <UserCircle2 className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold">Información de Usuario</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="my-6 space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input autoFocus disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <PhoneField
                label="Teléfono"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isLoading}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea rows={2} disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={isLoading}>
              <Save />
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
