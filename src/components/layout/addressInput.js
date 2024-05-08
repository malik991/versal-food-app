export default function AddressInput({ addressProps, setAddressProp }) {
  const { mobile, Street, postCode, city, country } = addressProps;
  return (
    <>
      <label>Mobile</label>
      <input
        type="tel"
        value={mobile}
        onChange={(e) => setAddressProp("mobile", e.target.value)}
        placeholder="+123456"
      />
      <label>Street Address</label>
      <input
        type="text"
        value={Street}
        onChange={(e) => setAddressProp("Street", e.target.value)}
        placeholder="Street address"
      />
      <div className="flex gap-2">
        <div>
          <label>Postal Code</label>
          <input
            type="text"
            value={postCode}
            onChange={(e) => setAddressProp("postCode", e.target.value)}
            placeholder="Postal Code"
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setAddressProp("city", e.target.value)}
            placeholder="City"
          />
        </div>
      </div>
      <label>Country</label>
      <input
        type="text"
        value={country}
        onChange={(e) => setAddressProp("country", e.target.value)}
        placeholder="Country"
      />
    </>
  );
}
