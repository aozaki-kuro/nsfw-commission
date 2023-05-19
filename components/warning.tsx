import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'

function leave() {
  window.location.href = 'https://www.google.com'
}

export default function MyModal() {
  const [isOpen, setIsOpen] = useState(true)
  const confirmedAgeStorageKey = 'hasConfirmedAge'

  useEffect(() => {
    async function checkConfirmedAge() {
      const hasConfirmedAge = await localStorage.getItem(confirmedAgeStorageKey)
      if (hasConfirmedAge) {
        const timestamp = parseInt(hasConfirmedAge, 10)
        const confirmTime = Date.now() - 12 * 60 * 60 * 1000
        if (timestamp > confirmTime) {
          setIsOpen(false)
        }
      }
    }
    checkConfirmedAge()
  }, [])

  async function handleConfirmAge() {
    await localStorage.setItem(confirmedAgeStorageKey, Date.now().toString())
    closeModal()
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(true)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-xl dark:bg-white/5" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-back-dark">
                  <Image
                    src={require('public/images/nsfw-cover.jpg')}
                    alt="NSFW Commissions"
                    quality={95}
                    placeholder="blur"
                    className="mb-4"
                    priority={true}
                  />
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900 dark:text-gray-300"
                  >
                    {'['} Warning {']'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      You have to be over 18 to view the contents.
                      <br />
                      Please <b>leave now</b> if you are under 18.
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-center">
                    <button
                      type="button"
                      className="button-warning-general button-enter"
                      onClick={handleConfirmAge}
                    >
                      I am over 18
                    </button>
                    <div className="mx-3" />
                    <button
                      type="button"
                      className="button-warning-general button-leave"
                      onClick={leave}
                    >
                      Leave Now
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
