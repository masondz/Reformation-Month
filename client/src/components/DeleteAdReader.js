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
    
    let jsxId = `del-ad${adReader.ad_reader_id}`
    let targetId = `#del-ad${adReader.ad_reader_id}`

    return (
      <div>
        <button
            type="button"
            style={{ float: 'right' }}
            className="delete-adreader"
            data-bs-toggle="modal"
            data-bs-target={targetId}
        >
            Delete Reader
        </button>

       <div className="modal fade" id={jsxId} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete member?</p>
                    </div>
                 <div className="modal-footer">
                    <button
                        type="button"
                        onClick={() => deleteAdReader()}
                    >
                        Delete
                    </button>
                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>  
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
}

export default DeleteAdReader
