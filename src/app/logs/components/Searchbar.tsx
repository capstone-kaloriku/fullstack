import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { FaSearch } from 'react-icons/fa'

function Searchbar() {
  return (
    <div className="w-full my-6">
      <InputGroup className="px-4 py-6 rounded-lg border border-gray-300 text-muted-foreground">
        <InputGroupInput placeholder="Cari makanan Indonesia..." />
        <InputGroupAddon>
          <FaSearch />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default Searchbar