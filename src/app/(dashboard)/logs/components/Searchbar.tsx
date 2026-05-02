'use client';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { FaSearch } from 'react-icons/fa'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

function Searchbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full my-6">
      <form onSubmit={handleSearch}>
        <InputGroup className="px-4 py-6 rounded-lg border border-gray-300 text-muted-foreground">
          <InputGroupInput 
            placeholder="Cari makanan Indonesia..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon>
            <button type="submit" className="focus:outline-none flex items-center justify-center">
              <FaSearch />
            </button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}

export default Searchbar