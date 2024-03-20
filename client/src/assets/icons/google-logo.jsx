
const GoogleLogo = props => {
  return (
    /*
  <svg className={props.className} viewBox="0 0 48 48">
    <title>Google Logo</title>
    <clipPath id="g">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
    </clipPath>
    <g class="colors" clip-path="url(#g)">
      <path fill="#FBBC05" d="M0 37V11l17 13z"/>
      <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
      <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
      <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
    </g>
  </svg>
  */
  <svg className={props.className} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="g">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
    </clipPath>
    <g className="colors" clipPath="url(#g)">
      <path fill="#FBBC05" d="M0 37V11l17 13z"/>
      <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
      <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
      <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
    </g>
    <path d="M44.9872 19.8876L44.8978 19.5H44.5H24H23.5V20V28.5V29H24H35.1702C33.9208 33.7444 29.6888 36.5 24 36.5C17.0761 36.5 11.5 30.9239 11.5 24C11.5 17.0761 17.0761 11.5 24 11.5C26.9784 11.5 29.6678 12.5561 31.7834 14.287L32.1336 14.5735L32.4536 14.2536L38.8536 7.85355L39.2322 7.47496L38.8286 7.12311C34.8447 3.64998 29.73 1.5 24 1.5C11.5239 1.5 1.5 11.5239 1.5 24C1.5 36.4761 11.5239 46.5 24 46.5C35.2606 46.5 45.5 38.2915 45.5 24C45.5 22.6525 45.2932 21.2136 44.9872 19.8876Z" stroke="white" strokeWidth={1.75}/>
  </svg>
  
  )
}

export default GoogleLogo