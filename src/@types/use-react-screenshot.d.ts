declare module 'use-react-screenshot' {
  type UseScreenshot = (options?: {
    type: 'image/jpeg' | 'image/png'
    quality: number
  }) => [string | null, (ref: HTMLDivElement, opts?: Partial<import('html2canvas').Options>) => void];
  declare const useScreenshot: UseScreenshot;
  // eslint-disable-next-line import/prefer-default-export
  export { useScreenshot };
}
