export const confirmEmail = (
  title: string,
  name: string,
  url: string
) => `<html lang='en'>
            <head>
              <meta charset='UTF-8' />
              <meta http-equiv='X-UA-Compatible' content='IE=edge' />
              <meta name='viewport' content='width=device-width, initial-scale=1.0' />
              <title>${title}</title>
            </head>
            <body>
            <h3>Travel Me</h3>
            <h1>${title}</h1>
              <h1 style="color:blue;font-size:24px">Hi
              ${name}!</h1>
              
             <h3> Please confirm your email by clicking the button below. If it does
              not work, just copy the link to your browser address bar!
              <a href="${url}">${url}</a>
              </h3>
          
              <div style="display:flex;justify-content:center;align-items:center"><button style="padding:20px;background-color:blue;color:white;border-radius:4px"><a style="color:white;text-decoration:none" href="${url}">Confirm Email</a></button>
              </div>
            </body>
          </html></h1>`;

export const resetPasswordEmail = (
  title: string,
  name: string,
  url: string
) => `<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <meta http-equiv='X-UA-Compatible' content='IE=edge' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <title>${title}</title>
</head>
<body>
<h3>Travel Me</h3>
<h1>${title}</h1>
  <h1 style="color:blue;font-size:24px">Hi
  ${name}!</h1>
  

  <div style="display:flex;justify-content:center;align-items:center"><button style="padding:20px;background-color:blue;color:white;border-radius:4px"><a style="color:white;text-decoration:none" href="${url}">Reset Password</a></button>
  </div>
</body>
</html></h1>`;
