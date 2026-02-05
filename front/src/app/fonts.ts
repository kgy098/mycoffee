import localFont from 'next/font/local'

export const suite = localFont({
  src: [
    {
      path: './fonts/SUITE-otf/SUITE-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/SUITE-otf/SUITE-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SUITE-otf/SUITE-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SUITE-otf/SUITE-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SUITE-otf/SUITE-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SUITE-otf/SUITE-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-suite',
  display: 'swap',
  preload: true,
})