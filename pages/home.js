import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'

import CreateRoom from '../components/CreateRoom'
import JoinRoom from '../components/JoinRoom'
import { ErrorLabel } from '../components/ErrorLabel'
import { useRouter } from 'next/router'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  const router = useRouter()

  const code = router.query.errorcode

  let msg = ''

  if (code)
    switch (code) {
      case '308':
        msg = t.noRoomExists
        break
      case '309':
        msg = t.noUserExists
        break
      case '310':
        msg = t.notRoomMember
        break
      case '311':
        msg = t.removedFromRoom
        break
      default:
        msg = t.genericError
    }

  return (
    <div className="flex flex-col">
      {code && (
        <div className="container mx-auto sm:flex sm:justify-center sm:gap-x-5">
          <ErrorLabel
            message={msg}
            className="pb-4"
            hidden={false}
            serverError={true}
          />
        </div>
      )}
      <div
        data-testid="homeContent"
        id="homeContent"
        className="container mx-auto flex flex-col md:flex-row xl:w-auto xl:space-x-6"
      >
        <CreateRoom locale={props.locale} />
        <JoinRoom locale={props.locale} />
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  /* istanbul ignore next */
  const langToggleLink = locale === 'en' ? '/fr/home' : '/home'
  /* Place-holder Meta Data Props */
  const meta = {
    data_en: {
      title: 'Scrum Poker - Home',
      desc: 'English',
      author: 'Service Canada',
      keywords: '',
    },
    data_fr: {
      title: 'Scrum Poker - Accueil',
      desc: 'Français',
      author: 'Service Canada',
      keywords: '',
    },
  }
  return {
    props: { locale, langToggleLink, meta },
  }
}

Home.propTypes = {
  //current locale in the address
  locale: PropTypes.string,
  //Meta Tags
  meta: PropTypes.object,
}
