import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { FaSearch } from 'react-icons/fa'

function Searchbar() {
  return (
    <div className="w-full my-6">
      <InputGroup className="px-4 py-6 flex items-center rounded-lg border border-primary-foreground text-primary-foreground">
        <InputGroupInput className='placeholder:text-primary-foreground' placeholder="Cari makanan Indonesia..." />
        <InputGroupAddon className='text-primary-foreground'>
          <FaSearch />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default Searchbar