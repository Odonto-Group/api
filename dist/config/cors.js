const corsConfig = {
    enabled: true,
    origin: 'https://dev.odontogroup.com.br',
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    headers: true,
    exposeHeaders: [
        'cache-control',
        'content-language',
        'content-type',
        'expires',
        'last-modified',
        'pragma',
    ],
    credentials: false,  // Teste com 'false'
    maxAge: 90,
};
