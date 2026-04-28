import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import NavbarStandalone from '../components/NavbarStandalone'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Settings = () => {
  return (
    <>
      <NavbarStandalone>Pengaturan Akun</NavbarStandalone>
      <div className='grid grid-cols-1 w-full mx-auto p-6 max-w-2xl lg:max-w-3xl gap-6'>
        <div className='flex flex-col justify-center gap-1.5'>
          <h1 className='text-2xl font-bold text-primary'>Pengaturan Akun</h1>
          <span className='text-base text-muted-foreground font-medium'>
            Kelola preferensi dan data pribadi anda
          </span>
        </div>
        <div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input id='email' type='email' placeholder='sahrulbatagor@gmail.com' value='sahrulbatagor@gmail.com' />
            </Field>
            <Field>
              <FieldLabel htmlFor='name'>Nama Lengkap</FieldLabel>
              <Input id='name' type='text' placeholder='Sahrul Batagor' value='Sahrul Batagor' />
            </Field>
            <Field>
              <FieldLabel htmlFor='password'>Kata Sandi Lama</FieldLabel>
              <Input id='password' type='password' placeholder='Kata sandi lama' />
            </Field>
            <Field>
              <FieldLabel htmlFor='changepassword'>Kata Sandi Baru</FieldLabel>
              <Input id='changepassword' type='password' placeholder='Kata sandi baru' />
            </Field>
            <Button variant='default' className='w-full mt-4'>Simpan Perubahan</Button>
          </FieldGroup>
        </div>
      </div>
    </>
  )
}

export default Settings