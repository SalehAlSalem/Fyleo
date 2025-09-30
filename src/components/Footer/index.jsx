import classNames from 'classnames';
import React from 'react';
import { Link } from "react-router-dom";

const socials = [
  {
    name: "GitHub",
    svgPath: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z",
    viewBox: "0 0 24 24",
    link: "https://github.com/SalehAlSalem/Fyleo"
  },
  {
    name: "Email",
    svgPath: "M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z",
    viewBox: "0 0 16 16",
    link: "mailto:fyleo.bawa3neh.97@gmail.com"
  },
]

const Footer = () => {
  let borderColor = "#87CEFA";
  let centerColor = "#B9D9EB";
  return (
    <footer

        className={`w-screen min-h-[50vh] py-14 flex flex-col items-center justify-center gap-6 dark:bg-[#44403C] dark:text-white bg-[#B9D9EB]`}
      >

      <div className="relative h-fit w-screen flex flex-col items-center justify-center">

        <div className={classNames({
          'w-1/4 h-fit p-2': true,
          'flex items-center justify-center': true,
          'monu font-bold text-xl text-[#37474f]': true,
          'dark:text-white': true,
          'mobile:text-lg': true,
        })}>
          <Link to='/'>Fyleo</Link>
        </div>


        <div className="w-[95vw] sm:w-[35rem] mt-4 dark:bg-[#44403C] dark:text-white">

          <p className="comfort text-center text-gray-800 font-bold mobile:text-sm dark:bg-[#44403C] dark:text-white">
            فايليو هي منصة تعليمية مخصصة لمشاركة الموارد الأكاديمية، تتيح للطلاب الوصول إلى المواد التعليمية وتبادلها مثل الملاحظات والدروس والامتحانات السابقة. تعمل المنصة بتقنية Appwrite المتطورة لضمان الأمان والسرعة.
          </p>

          <div className="mt-6 pl-5 w-full flex items-center justify-center gap-4 scale-[0.75]">
            {socials.map((social, index) => {
              return (
                <a
                  key={index}
                  className={classNames({
                    "bg-gray-900 px-4 py-1 rounded-[5rem]": true,
                    "flex items-center justify-center gap-0": true,
                    "text-gray-900 transition hover:text-gray-700": true,
                  })}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="h-12 w-12 translate-y-[0.4rem] translate-x-1"
                    fill="currentColor"
                    viewBox={social.viewBox}
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d={social.svgPath}
                      clipRule="evenodd"
                      fill="#ffffff"
                    />
                  </svg>
                  <span className="text-[#E2E8F0] font-bold -translate-x-1">{social.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;