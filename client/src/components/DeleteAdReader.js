import React from 'react'
import { toast } from 'react-toastify'

const DeleteAdReader = ({
    setAuth,
    adReader,
    reader,
    adReaders,
    setAdReaders,
    famGroup,
}) => {
    console.log(adReader)
    const deleteAdReader = async () => {
        //possible delete adReader from list
        const choice = window.confirm(
        "Are you sure you want to delete this member?" 
        )
     try {
        if (choice === true) {       
        let reader_id = reader.id
        let ad_reader_id = adReader.ad_reader_id
        let fg_id = famGroup.id
        
            const body = { reader_id, ad_reader_id, fg_id }
            const response = await fetch('/additional-readers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            })
            console.log(response.status)
            if (response.status === 403) {
                return toast.error(
                    'You must be creator of reader to delete reader.'
                )
            }
            const newList = adReaders.filter(
                (addReader) => addReader.ad_reader_id !== ad_reader_id
            )
            setAdReaders(newList)
        } else {
            toast.warning('Member not deleted')
        }
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <button
            type="button"
            style={{ float: 'right' }}
            className="delete-adreader"
            onClick={() => deleteAdReader()}
        >
            Delete Reader
        </button>
    )
}

export default DeleteAdReader
