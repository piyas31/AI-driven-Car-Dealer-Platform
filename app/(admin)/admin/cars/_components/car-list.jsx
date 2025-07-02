import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import React from 'react'

const CarsList = () => {
  return (
    <div className='space-y-4'>
        <div>
            <Button>
                <Plus className='h-4 w-4'/>
                Add Car
                </Button>
                <form>
                    <div>
                        <Search/>
                        <Input/>
                    </div>
                </form>
        </div>

        {/* Cars Table */}
    </div>
  )
}

export default CarsList