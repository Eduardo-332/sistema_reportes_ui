import settings from "@/lib/settings";

export async function getReports() {
  try {
    const response = await fetch(`${settings.URL}/api/request`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response (GET):", data);

    return Array.isArray(data) ? data : data.results || data.data || [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

export async function createReport(pokemonType, sampleSize) {
  try {
    const body = {
      pokemon_type: pokemonType,
    };

    if (sampleSize) {
      body.sample_size = parseInt(sampleSize);
    }

    const response = await fetch(`${settings.URL}/api/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response (POST):", data);

    return data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

export async function deleteReport(reportId) {
  try {
    const response = await fetch(`${settings.URL}/api/report/${reportId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    console.log(`Reporte con ID ${reportId} eliminado correctamente.`);
    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}
