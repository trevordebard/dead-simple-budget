import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --purple-100: #F9DCFA;
  --purple-200: #F0BAF6;
  --purple-300: #D891E6;
  --purple-400: #B76FCD;
  --purple-500: #8D43AD;
  --purple-600: #6F3094;
  --purple-700: #55217C;
  --purple-800: #3C1564;
  --purple-900: #2B0C53;
  --purple-transparent-100: rgba(141, 67, 173, 0.08);
  --purple-transparent-200: rgba(141, 67, 173, 0.16);
  --purple-transparent-300: rgba(141, 67, 173, 0.24);
  --purple-transparent-400: rgba(141, 67, 173, 0.32);
  --purple-transparent-500: rgba(141, 67, 173, 0.4);
  --purple-transparent-600: rgba(141, 67, 173, 0.48);
  --green-100: #D7FADB;
  --green-200: #B0F6C0;
  --green-300: #84E6A4;
  --green-400: #60CE8F;
  --green-500: #32ae74;
  --green-600: #24956C;
  --green-700: #197D62;
  --green-800: #0F6456;
  --green-900: #09534E;
  --green-transparent-100: rgba(50, 174, 116, 0.08);
  --green-transparent-200: rgba(50, 174, 116, 0.16);
  --green-transparent-300: rgba(50, 174, 116, 0.24);
  --green-transparent-400: rgba(50, 174, 116, 0.32);
  --green-transparent-500: rgba(50, 174, 116, 0.4);
  --green-transparent-600: rgba(50, 174, 116, 0.48);
  --aqua-100: #CBFDFB;
  --aqua-200: #97F7FB;
  --aqua-300: #63E4F4;
  --aqua-400: #3BCAE9;
  --aqua-500: #02A5DB;
  --aqua-600: #0180BC;
  --aqua-700: #01609D;
  --aqua-800: #00447F;
  --aqua-900: #003169;
  --aqua-transparent-100: rgba(2, 165, 219, 0.08);
  --aqua-transparent-200: rgba(2, 165, 219, 0.16);
  --aqua-transparent-300: rgba(2, 165, 219, 0.24);
  --aqua-transparent-400: rgba(2, 165, 219, 0.32);
  --aqua-transparent-500: rgba(2, 165, 219, 0.4);
  --aqua-transparent-600: rgba(2, 165, 219, 0.48);
  --yellow-100: #FEFACC;
  --yellow-200: #FEF39A;
  --yellow-300: #FCEA67;
  --yellow-400: #FAE141;
  --yellow-500: #F7D204;
  --yellow-600: #D4B102;
  --yellow-700: #B19102;
  --yellow-800: #8F7201;
  --yellow-900: #765D00;
  --yellow-transparent-100: rgba(247, 210, 4, 0.08);
  --yellow-transparent-200: rgba(247, 210, 4, 0.16);
  --yellow-transparent-300: rgba(247, 210, 4, 0.24);
  --yellow-transparent-400: rgba(247, 210, 4, 0.32);
  --yellow-transparent-500: rgba(247, 210, 4, 0.4);
  --yellow-transparent-600: rgba(247, 210, 4, 0.48);
  --red-100: #FDE8D0;
  --red-200: #FBCCA1;
  --red-300: #F4A671;
  --red-400: #E9814D;
  --red-500: #DB4C18;
  --red-600: #BC3311;
  --red-700: #9D1E0C;
  --red-800: #7F0E07;
  --red-900: #690405;
  --red-transparent-100: rgba(219, 76, 24, 0.08);
  --red-transparent-200: rgba(219, 76, 24, 0.16);
  --red-transparent-300: rgba(219, 76, 24, 0.24);
  --red-transparent-400: rgba(219, 76, 24, 0.32);
  --red-transparent-500: rgba(219, 76, 24, 0.4);
  --red-transparent-600: rgba(219, 76, 24, 0.48);

  --black-100: #DAEDF6;
  --black-200: #B8D9ED;
  --black-300: #86ADCB;
  --black-400: #577997;
  --black-500: #243A52;
  --black-600: #1A2D46;
  --black-700: #12213B;
  --black-800: #0B172F;
  --black-900: #061027;

  --grey-100: #F8FAFB;
  --grey-200: #F1F6F8;
  --grey-300: #E0E7EA;
  --grey-400: #CAD1D5;
  --grey-500: #ADB4B9;
  --grey-600: #7E8F9F;
  --grey-700: #576C85;
  --grey-800: #374C6B;
  --grey-900: #213458;
  --grey-transparent-100: rgba(173, 180, 185, 0.08);
  --grey-transparent-200: rgba(173, 180, 185, 0.16);
  --grey-transparent-300: rgba(173, 180, 185, 0.24);
  --grey-transparent-400: rgba(173, 180, 185, 0.32);
  --grey-transparent-500: rgba(173, 180, 185, 0.4);
  --grey-transparent-600: rgba(173, 180, 185, 0.48);
  --white: #fff;

  --lineColor: #EAEAEA;
  --backgroundSubtle: hsl(211, 39%, 23%, 3%);
  
  --fontColor: var(--black-600);
  --fontColorLight: var(--black-500);
  --baseFontSize: 100%;
  --smallFontSize: .8rem;
  
  --primary: var(--purple-500);
  --primaryHover: var(--purple-400);
  --primarySubtle: var(--purple-transparent-300);
  --action: var(--aqua-500);
  --actionHover: var(--aqua-600);
  --actionSubtle: var(--aqua-transparent-500);
  --danger: var(--red-700);
  --dangerHover: var(--red-600);
  --dangerSubtle: var(--red-transparent-600);
  --neutral: var(--fontColor);
  --neutralHover: var(--black-o10);
  --rowHover: var(--green-transparent-200);
  --rowHoverDark: var(--green-transparent-300);

  --buttonBg: var(--primary);
  --buttonHover: var(--primaryHover);
  --buttonSubtle: var(--primarySubtle);

  /* Elevation */
  --level1: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --level2: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --level3: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
div#__next{
  height: 100%;
}
html,body {
  box-sizing: border-box;
  max-width: 100%;
  font-size: var(--baseFontSize);
  height: 100%;
}
body {
  margin: 0;
  padding: 5px;
  color: var(--fontColor);
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  line-height: 1.65;
}

/* p {margin-bottom: 1.15rem;} */

h1, h2, h3, h4, h5 {
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
  line-height: 1.15;
  margin: 1rem .5rem;
}

h1 {
  font-size: 3.052em;
}

h2 {font-size: 2.441em;}

h3 {font-size: 1.953em;}

h4 {font-size: 1.563em;}

h5 {font-size: 1.25em;}

body,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
li,
p,
pre,
blockquote,
figure,
hr {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
input,
textarea,
select,
button {
  color: inherit; 
  font: inherit; 
  letter-spacing: inherit;
}
`;