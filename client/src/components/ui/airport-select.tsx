
import * as React from "react"
import { Check, ChevronsUpDown, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import airportsData from "@/lib/airports.json"

export interface Airport {
  code: string
  name: string
  city: string
  country: string
  lat: number
  lon: number
}

// Convert JSON data to typed array
const airports = airportsData as Airport[]

interface AirportSelectProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
}

export function AirportSelect({ value, onValueChange, label }: AirportSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  
  // Filter airports based on search to improve performance
  // Only show top 50 matches
  const filteredAirports = React.useMemo(() => {
    if (!search) return airports.slice(0, 20); // Default to first 20 (usually major ones if sorted, but here alphabetical)
    
    const lowerSearch = search.toLowerCase();
    const matches = [];
    
    // Priority to IATA match
    const exactMatch = airports.find(a => a.code.toLowerCase() === lowerSearch);
    if (exactMatch) matches.push(exactMatch);
    
    for (const airport of airports) {
      if (matches.length >= 50) break;
      if (airport === exactMatch) continue;
      
      if (
        airport.code.toLowerCase().includes(lowerSearch) ||
        airport.city.toLowerCase().includes(lowerSearch) ||
        airport.name.toLowerCase().includes(lowerSearch)
      ) {
        matches.push(airport);
      }
    }
    return matches;
  }, [search]);

  const selectedAirport = airports.find((a) => a.code === value)

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-[10px] font-mono text-muted-foreground uppercase">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 text-xs font-mono"
          >
            {selectedAirport ? (
               <span className="truncate flex items-center gap-2">
                 <span className="font-bold">{selectedAirport.code}</span>
                 <span className="text-muted-foreground truncate opacity-70 hidden sm:inline-block max-w-[120px]">
                   {selectedAirport.city}
                 </span>
               </span>
            ) : (
              <span className="text-muted-foreground opacity-50">Select airport...</span>
            )}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search code, city, or name..." 
              value={search}
              onValueChange={setSearch}
              className="h-9 text-xs"
            />
            <CommandList>
              <CommandEmpty>No airport found.</CommandEmpty>
              <CommandGroup>
                {filteredAirports.map((airport) => (
                  <CommandItem
                    key={airport.code}
                    value={airport.code}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue)
                      setOpen(false)
                    }}
                    className="text-xs font-mono cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        value === airport.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-primary">{airport.code}</span>
                         <span>{airport.city}, {airport.country}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[240px]">
                        {airport.name}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
