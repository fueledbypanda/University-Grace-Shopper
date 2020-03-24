import React, {useState} from 'react'

const Admin = ({user, createPromo, promos, deletePromo}) => {
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(0.0)
  
  const onSubmit = (el) => {
    el.preventDefault()
    console.log(user)
    createPromo(code, discount)
  }

  return (
    <div id="admin">
      <h1>{`Welcome, ${user.username}`}</h1>
      <form onSubmit={onSubmit}>
        <input type="text" value={code} onChange={(el) => setCode(el.target.value)}/>
        <span>
          <input type="number" value={discount} onChange={(el) => setDiscount(el.target.value)} />
          <span>%</span>
        </span>
        <button>Create Promo</button>
      </form>
      <div id="promos">
        <table className="table">
          <tbody>
          {
            promos.map(promo => {
              return(
                <tr key={promo.id}>
                  <td>{promo.code}</td>
                  <td>{promo.discount}%</td>
                  <td>
                    <button onClick={() => deletePromo(promo.id)}>Delete</button>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    </div>
 ) 
}

export default Admin