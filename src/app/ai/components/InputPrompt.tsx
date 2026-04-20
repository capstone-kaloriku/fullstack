import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FaMicrophone } from "react-icons/fa6";

export function InputPrompt() {
  return (
    <>
      <Field>
        <InputGroup className="px-3 py-6">
          <InputGroupInput placeholder="Makan apa kamu hari ini..." />
          <InputGroupAddon align="inline-end">
            <FaMicrophone />
            <Button>Kirim</Button>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </>
  );
}
