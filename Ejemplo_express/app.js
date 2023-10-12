const express = require('express')
const app = express()
const puerto = 3000
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use('/archivos', express.static('./archivos'))

app.get('/', (req,res)=>{
    res.send('Hola mundo, este es mi primer servicio con node y express')
})

app.get('/algo', (req,res)=>{
    res.send('Este es un get desde algo')
})

app.put('/algo', (req,res)=>{
    res.send('Este es un put desde algo')
})
app.post('/algo', (req,res)=>{
    res.send('Este es un post desde algo')
})
app.delete('/algo', (req,res)=>{
    res.send('Este es un delete desde algo')
})

app.post('/subirimagen', (req,res)=>{
    const imagenBase64 = req.body.imagen
    const imagenBuffer = Buffer.from(imagenBase64, 'Base64')
    const nombreArchivo = 'imagen_'+ Date.now() + '.png'
    const rutaArchivo = path.join(__dirname, '/archivos', nombreArchivo)

    fs.write(rutaArchivo,imagenBuffer,(error)=>{
        if(error){
            console.error('error al guardar la imagen')
            res.status(500).send('error al guardar la imagen')
        } else {
            console.log('imagen guardada con exito')
            res.send('imagen guardada con exito')
        }
    })
})

app.delete('/eliminar/:nombrearchivo', (req,res)=>{
    const nombreArchivo = req.params.nombrearchivo
    const rutaArchivoEliminar = path.join(__dirname, '/archivos', nombreArchivo)
    if(!fs.existsSync(rutaArchivoEliminar)){
        fs.unlinkSync(rutaArchivoEliminar)
        console.log('imagen eliminada con exito')
    } else {
        console.log('no se encontro la imagen a eliminar')
        res.status(404).send('no se encontre la imagen a eliminar')
    }
})

app.get('/descargarHTML', (req,res)=>{
    const cadena = req.query.cadena
    if(!cadena){
        return res.status(500).send('No se recibio ninguna cadena')
    } 
    const archivoHTML = path.join(__dirname, '/archivos/index.html')
    fs.readFile(archivoHTML, 'utf8', (error,data)=>{
        if(error){
            return res.status(500).send('no se logro leer el archivo HTML')
        }

        const textoAReemplazar = ':textoAReemplazar:'
        const htmlModificado = data.replace(textoAReemplazar, cadena)
        const archivoTemporal = path.join(__dirname, 'temp.html')

        fs.writeFile(archivoTemporal, htmlModificado, (error)=>{
            if(error){
                return res.status(500).send('no se logro escribir el archivo HTML')
            }
            res.download(archivoTemporal, 'archivo_modificado.html', (error)=>{
                if(error){
                    return res.status(500).send('no se logro descargar el archivo')
                }
                fs.unlink(archivoTemporal, (error)=>{
                    if(error){
                        return res.status(500).send('Error al eliminar el archivo temporal')
                    }
                })
            })
        })
    })
})


app.listen(puerto, ()=>{
    console.log('Servidor corriendo y escuchando a traves del puerto 3000')
})