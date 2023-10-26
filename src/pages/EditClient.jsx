import { Form, useNavigate, useLoaderData, useActionData, redirect } from 'react-router-dom'
import { getClient, updateClient } from '../data/clients'
import Form from '../components/Form'
import Error from '../components/Error'

export async function loader({params}) {
    const client = await getClient(params.clientId)
    if(Object.values(client).length === 0) {
        throw new Response('', {
            status: 404,
            statusText: 'Client not found'
        })
    }
    return client
}

export async function action({request, params}) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const email = formData.get('email')

    // Validation
    const errors = []
    if(Object.values(data).includes('')) {
        errors.push('All fields are required')
    }

    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    if(!regex.test(email)) {
        errors.push('Email is not valid')
    }

    // Return data if there are errors
    if(Object.keys(errors).length) {
        return errors
    }

    // Update client
    await updateClient(params.clientId, data)
    return redirect('/')
}

function EditClient() {
    const navigate = useNavigate();
    const client = useLoaderData()
    const errors = useActionData()

    return (
        <>
            <h1 className="font-black text-4xl text-blue-900">Edit client</h1>
            <p className="mt-3">Below you can modify a client's data</p>

            <div className="flex justify-end">
                <button
                    className="bg-blue-800 text-white px-3 py-1 font-bold uppercase"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>
            </div>


            <div className='bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20'>

                {errors?.length && errors.map( ( error, i ) => <Error key={i}>{error}</Error> )}
                
                <Form
                    method='post'
                    noValidate
                >
                    <Formulario 
                        client={client}
                    />

                    <input 
                        type="submit"
                        className='mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg'
                        value="Save changes"
                    />
                </Form>
            </div>
        </>
    )
}

export default EditarCliente