import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'
import MetaData from './MetaData'

import en from '../locales/en'
import fr from '../locales/fr'

export default function Layout(props) {
  const t = props.locale === 'en' ? en : fr

  return (
    <>
      <MetaData language={props.locale} data={props.meta}></MetaData>

      <Header
        language={props.locale}
        t={t}
        langToggleLink={props.langToggleLink}
      ></Header>

      <main>
        <div>{props.children}</div>
      </main>

      <Footer
        footerLogoAltText="symbol2"
        footerLogoImage="/wmms-blk.svg"
        footerNav1="aboutGovernment"
        footerNav2="aboutThisSite"
        t={t}
        links={[
          {
            link: t.footerSocialMediaURL,
            linkText: t.footerSocialMedia,
          },
          {
            link: t.footerMobileAppURL,
            linkText: t.footerMobileApp,
          },
          {
            link: t.footerAboutURL,
            linkText: t.footerAbout,
          },
          {
            link: t.footerTermsAndConditionURL,
            linkText: t.footerTermsAndCondition,
          },
          {
            link: t.footerPrivacyURL,
            linkText: t.footerPrivacy,
          },
        ]}
        footerBoxLinks={[
          {
            footerBoxlink: t.footerContributeURL,
            footerBoxLinkText: t.footerContribute,
          },
          {
            footerBoxlink: t.footerReportIssueURL,
            footerBoxLinkText: t.footerReportIssue,
          },
          {
            footerBoxlink: t.footerSuggestionURL,
            footerBoxLinkText: t.footerSuggestion,
          },
        ]}
      />
    </>
  )
}

/**
 * Setup default props
 */

Layout.defaultProps = {
  title: 'Scrum Poker',
}

Layout.propTypes = {
  /*
   * Locale current language
   */
  locale: PropTypes.string,
  /*
   * Meta Tags
   */
  meta: PropTypes.object,
  /*
   * Title of the page
   */
  title: PropTypes.string,
  /*
   * Link of the page in opposite language
   */
  langToggleLink: PropTypes.string,
}
