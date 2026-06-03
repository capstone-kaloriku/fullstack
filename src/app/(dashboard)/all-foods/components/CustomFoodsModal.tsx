import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ModalsProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  foodTitle: string;
  foodDescription: string;
}

function CustomFoodsModal({
  isOpen,
  onClose,
  foodTitle,
  foodDescription,
}: ModalsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Validasi Makanan</DialogTitle>
            <DialogDescription>
              Validasi informasi makanan yang kamu masukkan dengan bantuan AI
              untuk memastikan keakuratan data.
            </DialogDescription>
          </DialogHeader>
          <div className="-mx-4 scrollbar-none max-h-[50vh] overflow-auto px-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama Makanan</FieldLabel>
                <Input
                  disabled
                  className="border-gray-300"
                  id="name"
                  name="name"
                  defaultValue={foodTitle}
                />
              </Field>
              <Field>
                <Label htmlFor="description">Deskripsi Makanan</Label>
                <Textarea
                  className="border-gray-300"
                  id="description"
                  name="description"
                  defaultValue={foodDescription}
                />
              </Field>
            </FieldGroup>
            <div className="flex flex-col gap-4 mt-4">
              <p>Keterangan</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Kalori</Badge>
                <Badge>Protein</Badge>
                <Badge>Karbohidrat</Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              nativeButton={true}
              render={(props) => (
                <Button {...props} variant="outline">
                  Batal
                </Button>
              )}
            />
            <Button type="submit">Simpan Makanan</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CustomFoodsModal;
