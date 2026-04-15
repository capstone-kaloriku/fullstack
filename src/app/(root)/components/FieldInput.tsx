import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

function FieldInput() {
  return (
    <>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Email</FieldLabel>
            <Input id="username" type="text" placeholder="Email" />
            <FieldDescription>Masukkan email Anda</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" placeholder="Password" />
            <FieldDescription>Masukkan kata sandi Anda</FieldDescription>
          </Field>
          <Button className="w-full py-6">Masuk</Button>
        </FieldGroup>
      </FieldSet>
    </>
  );
}

export default FieldInput;
