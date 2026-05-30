import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CustomFoods() {
    return (
        <Card className="h-full w-full flex flex-col gap-5 my-6">
            <CardHeader>
                <h1 className="text-2xl font-bold text-primary">Custom Food</h1>
                <CardDescription>
                    Kamu bisa menambahkan makananmu sendiri
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Nama Makanan</FieldLabel>
                            <Input className="border-gray-300" />
                        </Field>
                        <Field>
                            <FieldLabel>Deskripsi</FieldLabel>
                            <Textarea className="border-gray-300" />
                        </Field>
                    <Button>Validasi dengan Kalorai</Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default CustomFoods;