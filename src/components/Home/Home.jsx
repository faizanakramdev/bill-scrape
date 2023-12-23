import React, { useEffect, useState } from "react";
import axios from "axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ApiRequest = () => {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [responses, setResponses] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [inputError, setInputError] = useState("");


  const parseResponseData = (doc, endpoint) => {
    const getTextContent = (selector) =>
      doc.querySelector(selector)?.textContent.replace(/\s+/g, " ").trim() ||
      "";
    const address1 = getTextContent(
      "body > div.maincontent > table > tbody > tr:nth-child(1) > td.border-rtop > table > tbody > tr:nth-child(5) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td"
    );
    const address2 = getTextContent(
      "body > div.maincontent > table > tbody > tr:nth-child(1) > td.border-rtop > table > tbody > tr:nth-child(5) > td:nth-child(1) > table > tbody > tr:nth-child(3) > td"
    );
    const combinedAddress = `${address1}, ${address2}`;
    const ntnSelector = getTextContent(
      "body > div.maincontent > table > tbody > tr:nth-child(1) > td.border-rtop > table > tbody > tr:nth-child(5) > td:nth-child(2)"
    ).match(/NTN # (\d+)/);
    return {
      referenceNo: getTextContent(
        "body > div.maincontent > table > tbody > tr:nth-child(1) > td.border-rtop > table > tbody > tr:nth-child(4) > td.border-rb.bodyContentValue"
      ).replace(/\s/g, ""),
      address: combinedAddress.split("GST #")[0].trim(),
      ntn: ntnSelector[0].match(/\d+/g)?.join("") || "",
      gstNo:
        getTextContent(
          "body > div.maincontent > table > tbody > tr:nth-child(1) > td.border-rtop > table > tbody > tr:nth-child(5) > td:nth-child(1) > table > tbody > tr:nth-child(3) > td > b"
        )
          .match(/\d+/g)
          ?.join("") || "",
      billMonth: getTextContent(
        "body > div.maincontent > div.header > div > table > tbody > tr.bodyContentValue > td:nth-child(5)"
      ),
      gst: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(4)"
      ),
      incomeTax: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(4)"
      ).split(" ")[0],
      extraTax: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(4)"
      ),
      furtherTax: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table:nth-child(1) > tbody > tr:nth-child(7) > td:nth-child(4)"
      ),
      sTax: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table:nth-child(1) > tbody > tr:nth-child(9) > td:nth-child(4)"
      ),
      arrear: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(1) > td.nestedtd2width.bodyContentValue"
      ),
      currentBill: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(2) > td.nestedtd2width.bodyContentValue"
      ),
      billAdjustment: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(3) > td.nestedtd2width.bodyContentValue"
      ),
      installment: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(4) > td.nestedtd2width.bodyContentValue"
      ),
      totalFPA: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(5) > td.nestedtd2width.bodyContentValue > div:nth-child(1)"
      ),
      payableWithinDueDate: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(7) > td.nestedtd2width.bodyContentValue"
      ),
      lPSurcharge: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(8) > td.nestedtd2width.bodyContentValue"
      ),
      payableAfterDueDate: getTextContent(
        "body > div.maincontent > div:nth-child(3) > table.nested7.bordertop > tbody > tr:nth-child(9) > td.nestedtd2width.bodyContentValue.border-bt"
      ),
      issueDate: getTextContent(
        "body > div.maincontent > div.header > div > table > tbody > tr.bodyContentValue > td:nth-child(7)"
      ),
      dueDate: getTextContent(
        "body > div.maincontent > div.header > div > table > tbody > tr.bodyContentValue > td:nth-child(8)"
      ),
      consumerId: getTextContent(
        "body > div.maincontent > table > tbody > tr:nth-child(1) > td.border-rtop > table > tbody > tr:nth-child(2) > td:nth-child(1)"
      ),
    };
  };

  const fetchData = async () => {
    const isValidReference = /^\d{14,}$/.test(referenceNumber);

    if (!referenceNumber.trim()) {
      setInputError("Please enter a reference number");
      return;
    } else if (!isValidReference) {
      setInputError(
        "Please enter a valid reference number (at least 14 digits)"
      );
      return;
    } else {
      let isValid = [];
      setInputError("");
      const host = `https://bill.pitc.com.pk/`;
      const apiEndpoints = [
        "fescobill/industrial",
        "gepcobill/industrial",
        "iescobill/industrial",
        "mepcobill/industrial",
        "pescobill/industrial",
        "hescobill/industrial",
        "sepcobill/industrial",
        "tescobill/industrial",
      ];
      setFetchingData(true);

      isValid = responses?.filter(
        (item) => item?.referenceNo?.slice(0, -1) === referenceNumber
      );

      if (isValid?.length !== 0) {
        setInputError(
          "Please Enter other reference number because already exist"
        );
        setFetchingData(false);
      } else {
        try {
          const fetchPromises = apiEndpoints.map((endpoint) =>
            axios.get(`${host}${endpoint}?refno=${referenceNumber}`)
          );

          const responses = await Promise.all(
            fetchPromises.map((p) => p.catch((e) => e))
          );
          const validResponses = responses.filter(
            (response) =>
              response.status === 200 &&
              response.data.trim() !== "" &&
              !response.data.includes("Bill Not Found!")
          );

          const newResponses = validResponses.map((response, index) => {
            const doc = new DOMParser().parseFromString(
              response.data,
              "text/html"
            );
            return parseResponseData(doc, apiEndpoints[index]);
          });
          setResponses((prev) => [...newResponses, ...prev]);
          // setResponses([...responses, newResponses]);
          setReferenceNumber("");
        } catch (error) {
          console.error("Error:", error.message);
        } finally {
          setFetchingData(false);
        }
      }
    }
  };

  const saveToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(responses);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "ResponseData" + fileExtension);
  };

  return (
    <>
      <div>
        <label htmlFor="referenceInput">Enter Reference Number:</label>
        <input
          type="text"
          id="referenceInput"
          required
          placeholder="Enter reference number"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
        />
        {inputError && (
          <div style={{ color: "red", textAlign: "center" }}>{inputError}</div>
        )}
        <button onClick={fetchData} disabled={fetchingData}>
          {fetchingData ? "Fetching..." : "Fetch Data"}
        </button>
        {responses.length > 0 && (
          <button onClick={saveToExcel}>Download Excel</button>
        )}
        {responses.length > 0 && (
          <h6>
            Total Response: {responses.length === 0 ? "" : responses.length}
          </h6>
        )}

        <div id="response-container">
          {responses.length === 0 && !fetchingData && (
            <div>No valid responses received.</div>
          )}
          {responses.map((response, index) => (
            <div key={index}>
              Reference Number: {response.referenceNo}
              <br />
              Address: {response.address}
              {index < responses.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ApiRequest;
