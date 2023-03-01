import AuthenticationService from 'App/Services/AuthenticationService'

const app = await new AdonisApplication().run()

app.container.singleton('App/Services/ExemploService', () => {
  return new AuthenticationService()
})
