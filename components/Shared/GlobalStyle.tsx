import { smBreakpoint } from 'lib/constants';
import { createGlobalStyle } from 'styled-components';

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

  --aqua-100: hsl(185, 94%, 87%);
  --aqua-200: hsl(184, 80%, 74%);
  --aqua-300: hsl(184, 65%, 59%);
  --aqua-400: hsl(185, 57%, 50%);
  --aqua-500: hsl(185, 62%, 45%);
  --aqua-600: hsl(184, 90%, 34%);
  --aqua-700: hsl(184, 77%, 34%);
  --aqua-800: hsl(185, 81%, 29%);
  --aqua-900: hsl(185, 84%, 25%);
  --aqua-800:hsl(184, 91%, 17%);
  
  --aqua-transparent-100: hsl(185, 81%, 29%, .08);
  --aqua-transparent-200: hsl(185, 81%, 29%, .16);
  --aqua-transparent-300: hsl(185, 81%, 29%, .24);
  --aqua-transparent-400: hsl(185, 81%, 29%, .32);
  --aqua-transparent-500: hsl(185, 81%, 29%, .40);
  
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

  --red-100: hsl(360, 100%, 95%);
  --red-200: hsl(360, 100%, 87%);
  --red-300: hsl(360, 100%, 80%);
  --red-400: hsl(360, 91%, 69%);
  --red-500: hsl(360, 83%, 62%);
  --red-600: hsl(356, 75%, 53%);
  --red-700: hsl(354, 85%, 44%);
  --red-800: hsl(352, 90%, 35%);
  --red-900: hsl(350, 94%, 28%);
  --red-1000: hsl(348, 94%, 20%);
  --red-transparent-100: hsl(352, 90%, 35%, 8%);
  --red-transparent-200: hsl(352, 90%, 35%, 16%);
  --red-transparent-300: hsl(352, 90%, 35%, 32%);
  --red-transparent-400: hsl(352, 90%, 35%, 40%);
  --red-transparent-500: hsl(352, 90%, 35%, 48%);

  --grey-100: hsl(216, 33%, 97%);
  --grey-200: hsl(214, 15%, 91%);
  --grey-300: hsl(210, 16%, 82%);
  --grey-400: hsl(211, 13%, 65%);
  --grey-500: hsl(211, 10%, 53%);
  --grey-600: hsl(211, 12%, 43%);
  --grey-700: hsl(209, 14%, 37%);
  --grey-800: hsl(209, 18%, 30%);
  --grey-900: hsl(209, 20%, 25%);
  --grey-1000: hsl(210, 24%, 16%);

  --grey-transparent-100: hsl(211, 10%, 53%, .08);
  --grey-transparent-200: hsl(211, 10%, 53%, .16);
  --grey-transparent-300: hsl(211, 10%, 53%, .32);
  --grey-transparent-400: hsl(211, 10%, 53%, .40);
  --grey-transparent-400: hsl(211, 10%, 53%, .48);
  
  --white: #fff;

  --lineColor: #EAEAEA;
  --backgroundSubtle: var(--grey-100);
  
  --fontColor: var(--grey-1000);
  --fontColorLight: var(--grey-800);
  --fontColorLighter: var(--grey-500);
  --baseFontSize: 100%;
  --smallFontSize: .9rem;
  
  --primary: var(--purple-500);
  --primaryHover: var(--purple-400);
  --primarySubtle: var(--purple-transparent-300);
  --action: var(--aqua-700);
  --actionHover: var(--aqua-600);
  --actionSubtle: var(--aqua-transparent-200);
  --danger: var(--red-800);
  --dangerHover: var(--red-700);
  --dangerSubtle: var(--red-transparent-200);
  --neutral: var(--grey-900);
  --neutralHover: var(--grey-transparent-200);

  --rowHover: var(--grey-transparent-100);
  --rowActive: var(--grey-transparent-200);
  --rowHoverDark: var(--grey-300);

  --buttonBg: var(--primary);
  --buttonHover: var(--primaryHover);
  --buttonSubtle: var(--primarySubtle);

  /* Elevation */
  --level1: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --level2: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --level3: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  @media only screen and (max-width: ${smBreakpoint}) {
    --baseFontSize: var(--smallFontSize)
  }
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
  font-family: sans-serif;
  font-weight: 400;
  line-height: 1.65;
}

/* p {margin-bottom: 1.15rem;} */

h1, h2, h3, h4, h5 {
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
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
