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
  const queryErrorCode = router.query.errorcode

  let errorCodeMsg = ''
  if (queryErrorCode)
    switch (queryErrorCode) {
      case '308':
        errorCodeMsg = t.noRoomExists
        break
      case '309':
        errorCodeMsg = t.noUserExists
        break
      case '310':
        errorCodeMsg = t.notRoomMember
        break
      default:
        errorCodeMsg = t.genericError
    }

  console.log(errorCodeMsg)

  return (
    <div>
      {router.query.errorcode && (
        <div className="container mx-auto">
          <ErrorLabel
            errorId="errorCodeMsg"
            message={errorCodeMsg}
            className="pb-4"
            hidden={false}
          ></ErrorLabel>
        </div>
      )}
      <div
        data-testid="homeContent"
        id="homeContent"
        className="container grid grid-cols-1 gap-y-5 mx-auto sm:flex sm:justify-center sm:gap-x-5"
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
