import React, {useState} from 'react'
import { toast } from 'react-toastify'

const DeleteAdReader = ({
    setAuth,
    adReader,
    reader,
    adReaders,
    setAdReaders,
    famGroup,
}) => {
    
    const [deleting, setDeleting] = useState(false);
    
//     const toggleDeleting = () => {
//         (!deleting) ? setDeleting(true) : setDeleting(false);
//     }
    
    //controls the modal
    const modal = document.querySelector("#delete-adreader-modal");
        const body = document.querySelector("body");
  
        const showModal = function (e) {
            modal.classList.toggle("hidden");
  
            if (!modal.classList.contains("hidden")) {
                // Disable scroll
                body.style.overflow = "hidden";
            } else {
                // Enable scroll
                body.style.overflow = "auto";
            }
        };
    
    const deleteAdReader = async () => {
        //possible delete adReader from list
     try {
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
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <button
            type="button"
            style={{ float: 'right' }}
            className="delete-adreader"
            onClick={(e) => showModal(e)}
        >
            Delete Reader
        </button>

       <div id="delete-adreader-modal" className="hidden">
            <div id="modal-body">
                <p>Are you sure you want to delete member?</p>
                <div className="delete-modal-options" >
                    <button
                        type="button"
                        onClick={() => deleteAdReader()}
                    >
                        Delete Reader
                    </button>
                   <button type="button" onClick={(e) => showModal(e)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAdReader
