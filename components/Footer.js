import PropTypes from 'prop-types'
import DateModified from '../components/DateModified'

/**
 * footer element for all pages
 */

export default function Footer(props) {
  return (
    <footer>
      <h2 className="sr-only">siteFooter</h2>
      <DateModified text={props.t.dateModified} />
      <div className="w-full">
        <div className="w-full h-auto bg-footer-parliament-image bg-no-repeat bg-right-bottom bg-[#26374A]">
          <div
            className="py-7 container mx-auto px-6"
            role="navigation"
            aria-labelledby="footerNav1"
          >
            <h3 className="sr-only" id="footerNav1">
              {props.footerNav1}
            </h3>
            <ul className="flex flex-col text-sm sm:grid sm:grid-cols-2 xl:grid xl:grid-cols-3 sm:gap-1">
              {' '}
              {props.footerBoxLinks.map((value, index) => {
                return (
                  <li
                    key={index}
                    className="text-white w-70 md:w-65 lg:w-80 my-2.5 hover:underline"
                  >
                    <a className="font-body" href={value.footerBoxlink}>
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 inline-block mr-3"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                      {value.footerBoxLinkText}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="w-full h-full pb-4">
          <div className="h-auto pt-5 container mx-auto px-6 flex flex-col xl:flex xl:flex-row md:justify-between">
            <div
              className="mt-3.5 xl:mt-5"
              role="navigation"
              aria-labelledby="footerNav2"
            >
              <h3 className="sr-only" id="footerNav2">
                {props.footerNav2}
              </h3>
              <ul className="flex flex-col md:grid md:grid-cols-2 xl:flex lg:flex-row">
                {props.links.map((value, index) => {
                  return (
                    <li
                      key={index}
                      className={
                        index === 0
                          ? 'lg:mb-4 mb-5 mr-2.5 list-inside list-disc xl:list-none text-sm'
                          : 'lg:mb-4 mb-5 mr-2.5 list-inside list-disc text-sm'
                      }
                    >
                      <a
                        className="text-sm font-body text-[#21303F] hover:text-[#5E8EBD]"
                        data-cy="social-media-link"
                        href={value.link}
                      >
                        {value.linkText}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <img
                className="mb-2.5 mt-8 xl:mt-0 h-6 md:h-10 w-auto float-right"
                src={props.footerLogoImage}
                alt={props.footerLogoAltText}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  /**
   * Screenreader section indicator
   */
  footerNav1: PropTypes.string,

  /**
   * Screenreader section indicator
   */
  footerNav2: PropTypes.string,
  /**
   * array of objects containing the link text and link
   */
  footerBoxLinks: PropTypes.arrayOf(
    PropTypes.shape({
      footerBoxlink: PropTypes.string.isRequired,
      footerBoxLinkText: PropTypes.string.isRequired,
    })
  ),
  /**
   * array of objects containing the link text and link
   */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      linkText: PropTypes.string.isRequired,
    })
  ),

  /**
   * alt text for footer canada-ca logo
   */
  footerLogoAltText: PropTypes.string.isRequired,

  /**
   * image path for footer logo
   */
  footerLogoImage: PropTypes.string.isRequired,
}
