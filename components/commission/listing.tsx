// Import necessary modules and components
import Image from 'next/image'
import IllustratorInfo from './illustrator-info'
import { commissionData } from '#data/CommissionData'
import type { CommissionInfoProps } from 'CommissionInfoProps'

// Define an interface to describe the component's expected props
interface Props {
  Character: string
}

// Define a function to render a single commission item given its information as a CommissionInfoProps object.
const renderCommission = (commission: CommissionInfoProps) => (
  <div key={`${commission.Creator}-${commission.PublishDate}`}>
    <Image
      src={require(`public/images/${commission.Character}/${commission.fileName}.jpg`)}
      alt={`${commission.Creator} ©️ ${commission.PublishDate}`}
      quality={95}
      placeholder="blur"
    />
    {/* Use the IllustratorInfo component to display the illustrator information */}
    <IllustratorInfo {...commission} />
  </div>
)

// Define the Listing component which takes in a props object of type Props. This component retrieves relevant commission data using the Character prop, renders the commission items, and displays all commissions at once.
const Listing = ({ Character }: Props) => {
  // Retrieve all commissions for the chosen character from the commissionData object,
  // convert their filenames to PublishDate and Creator values, and sort them by date (newest first).
  const lowercaseCharacter = Character.toLowerCase() // Convert the Character string to lowercase for case-insensitive comparison
  const commissions = Object.values(commissionData) // Get an array from the values of the commissionData object
    .filter(
      commission => commission.Character.toLowerCase() === lowercaseCharacter // Filter only by the character that matches in lowercase format
    )
    .map(commission => ({
      ...commission, // Spread the properties of the old object into a new object
      PublishDate: commission.fileName.slice(0, 8), // Extract the first 8 characters of the filename as PublishDate property
      Creator: commission.fileName.split('_')[1] // Extract the creator string from the filename and add it as Creator property
    }))
    .sort((a, b) => b.PublishDate.localeCompare(a.PublishDate)) // Sort the array of objects by PublishDate using localeCompare method

  // If there are no commissions, return a message indicating no works have been announced yet.
  if (commissions.length === 0) {
    return <p>To be announced ...</p>
  }

  return <>{commissions.map(renderCommission)}</>
}

// Export the Listing component as the default export of this module
export default Listing
