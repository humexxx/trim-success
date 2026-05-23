import { useState } from "react";

import { STORAGE_PATH } from "@shared/consts";
import { collection, doc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { ArrowRight, Database, Laptop2 } from "lucide-react";
import { useAuth, useCube } from "src/context/hooks";
import { firestore, storage } from "src/lib/firebase";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { FileResolution } from "./ImportDataPage";

interface Props {
  handleOnFinish: () => void;
  fileResolution: FileResolution;
}

const FileUploadStep = ({ handleOnFinish, fileResolution }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAdmin, customUser } = useAuth();
  const cube = useCube();

  async function handleOnClick() {
    if (!fileResolution?.file) {
      setError("No hay archivo para subir");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const uid = isAdmin ? customUser!.uid : currentUser!.uid;
      const generateUID = doc(collection(firestore, "random")).id;

      const storageRef = ref(storage, `${STORAGE_PATH}/${uid}/${generateUID}`);
      await uploadBytes(storageRef, fileResolution.file);
      await cube.initCube(generateUID, cube.data!.cubeParameters.drivers);
      await cube.reloadCubeData();
      handleOnFinish();
    } catch (e) {
      setError(`Error al subir el archivo: ${e}`);
      await cube.removeCube();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading && (
        <Alert>
          <AlertDescription>
            Esto puede tardar un par de minutos...
          </AlertDescription>
        </Alert>
      )}

      <p className="text-sm">
        Los datos cargados se usarán para crear los distintos reportes.
      </p>

      <div className="my-8 flex items-center gap-6 text-foreground">
        <Laptop2 className="h-10 w-10" />
        <ArrowRight className="h-10 w-10 animate-pulse" />
        <Database className="h-10 w-10" />
      </div>

      <Button onClick={handleOnClick} loading={loading}>
        Cargar Datos y Terminar
      </Button>
    </div>
  );
};

export default FileUploadStep;
