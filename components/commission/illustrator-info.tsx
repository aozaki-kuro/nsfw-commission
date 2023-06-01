import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Transition } from '@headlessui/react'
import { CommissionInfoProps } from 'CommissionInfoProps'

// Create a functional component named IllustratorInfo which takes in props of type CommissionInfoProps
const IllustratorInfo = ({
  PublishDate,
  Creator,
  Twitter,
  Skeb,
  Pixiv
}: CommissionInfoProps) => {
  // Format the date with white space characters and set it to state using the useState hook
  const [formattedDate, setFormattedDate] = useState<string>(
    // For "20 /  /  "
    '\u2000'.repeat(10)
  )

  // Run an effect whenever the PublishDate prop changes. This effect converts the PublishDate string to a Date object, formats it as a string, and updates the formattedDate state.
  useEffect(() => {
    const date = new Date(
      `${PublishDate.slice(0, 4)}-${PublishDate.slice(
        4,
        6
      )}-${PublishDate.slice(6, 8)}`
    )
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    setFormattedDate(formattedDate)
  }, [PublishDate])

  // Create a reusable function to generate links with proper styling
  const createLink = (url: string, text: string) => {
    return url ? (
      <>
        <Link href={url} className="underline-offset-[0.2rem]" target="_blank">
          {text}
        </Link>
        <span className="pr-3 ss:pr-2" />
      </>
    ) : null
  }

  // Render illustrator information in a grid layout using Tailwind CSS and the Transition component from HeadlessUI. This includes the formattedDate state, Creator prop (or '-' if there is no Creator), and links to the illustrator's social media pages (if they exist).
  return (
    <div className="flex flex-auto font-mono text-sm ss:text-xs">
      <Transition
        appear={true}
        show={true}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <span className="">{formattedDate}</span>
      </Transition>
      <span className="pr-16 ss:pr-6" />
      <span className="">{Creator || '-'}</span>
      <span className="grow text-right">
        {'['}
        <span className="pr-3 ss:pr-2" />
        {createLink(Twitter, 'Twitter')}
        {createLink(Pixiv, 'Pixiv')}
        {createLink(Skeb, 'Skeb')}
        {']'}
      </span>
    </div>
  )
}

// Export the IllustratorInfo component as the default export of this module.
export default IllustratorInfo
