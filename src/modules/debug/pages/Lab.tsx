import { useEffect } from "react";
import { useGlobalModal } from "../../../@zenidata/components/GlobalModal/GlobalModal";

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwidXNlcm5hbWUiOiJ3aWxsLW9yYWNpb25zIiwiZmlyc3RfbmFtZSI6IkxvdWlzIiwibGFzdF9uYW1lIjoiTWFyeSIsImVtYWlsIjoib3JhY2lvbnMuZGV2QGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbIkNSRUFURV9ET0NVTUVOVCIsIlJFQURfRE9DVU1FTlQiLCJVUERBVEVfRE9DVU1FTlQiLCJERUxFVEVfRE9DVU1FTlQiLCJDUkVBVEVfRk9MREVSIiwiUkVBRF9GT0xERVIiLCJVUERBVEVfRk9MREVSIiwiREVMRVRFX0ZPTERFUiIsIlJFQURfU1VCU0NSSVBUSU9OIiwiVVBEQVRFX1NVQlNDUklQVElPTiIsIlJFQURfT1dOX1VTRVIiLCJVUERBVEVfT1dOX1VTRVIiXSwiZXhwIjoxNzM4NDAzMDU1fQ.ZrWC12xE-QLOe6t0zoEamIM8Qdq6zIYYZdlCWboQYME";
const Lab = () => {
  const { globalModal } = useGlobalModal();

  useEffect(() => {
    const fetchData = () => {
      const expiredToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwidXNlcm5hbWUiOiJ3aWxsLW9yYWNpb25zIiwiZmlyc3RfbmFtZSI6IkxvdWlzIiwibGFzdF9uYW1lIjoiTWFyeSIsImVtYWlsIjoib3JhY2lvbnMuZGV2QGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbIkNSRUFURV9ET0NVTUVOVCIsIlJFQURfRE9DVU1FTlQiLCJVUERBVEVfRE9DVU1FTlQiLCJERUxFVEVfRE9DVU1FTlQiLCJDUkVBVEVfRk9MREVSIiwiUkVBRF9GT0xERVIiLCJVUERBVEVfRk9MREVSIiwiREVMRVRFX0ZPTERFUiIsIlJFQURfU1VCU0NSSVBUSU9OIiwiVVBEQVRFX1NVQlNDUklQVElPTiIsIlJFQURfT1dOX1VTRVIiLCJVUERBVEVfT1dOX1VTRVIiXSwiZXhwIjoxNzM4MzY3ODk2fQ.AWUy0zghvmjJ4qgOIkePPUKqVDF0Ku1breZi7AVSNvk";

      fetch(
        "https://izendoc-dev-u19609.vm.elestio.app/folders/?search=&status=active&page=1&limit=5",
        {
          method: "GET",
          headers: {
            Authorization: validToken,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Erreur Fetch:", error));
    };

    fetchData();
  }, []);
  return (
    <>
      <select>
        <option>option 1</option>
        <option>option 2</option>
      </select>
      <button
        onClick={() => {
          globalModal(
            "Mon titre",
            <>
              <h1>Mon contenue</h1>
            </>,
            ["confirm", "cancel"]
          );
        }}>
        Open modal
      </button>
    </>
  );
};

export default Lab;
