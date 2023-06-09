import CustomHead from '#components/custom-head'
import Link from 'next/link'

const YEAR = new Date().getFullYear()

const NextraThemeConfig = {
  head: CustomHead,

  footer: (
    <div>
      <small className="mt-32 block text-p-light dark:text-inherit">
        <time>2020 - {YEAR}</time> ©{' '}
        <Link
          href="https://twitter.com/CrystallizeSub"
          className="!decoration-inherit decoration-dotted"
        >
          Crystallize
        </Link>
        <div className="float-right">Afezeria</div>
      </small>
    </div>
  ),
}

export default NextraThemeConfig
