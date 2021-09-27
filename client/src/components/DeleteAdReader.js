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
        let reader_id = reader.id
        let ad_reader_id = adReader.ad_reader_id
        let fg_id = famGroup.id
        try {
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
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <button
            type="button"
            style={{ float: 'right' }}
            className="btn btn-sm btn-danger"
            onClick={() => deleteAdReader()}
        >
            Delete Reader
        </button>
    )
}

export default DeleteAdReader
