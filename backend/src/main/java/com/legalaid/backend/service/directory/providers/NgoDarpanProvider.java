package com.legalaid.backend.service.directory.providers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legalaid.backend.model.directory.DirectoryProfile;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;


@Service
public class NgoDarpanProvider {

    private final DirectoryProfileRepository repo;
    public NgoDarpanProvider(DirectoryProfileRepository repo) {
        this.repo = repo;
    }
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private static final String API =
            "https://ngodarpan.gov.in/api/public/ngo/search?page=%d";

    public int ingestAll() {
        int page = 1;
        int imported = 0;
       // int MAX_PAGES = 10;
       int LIMIT = 300;
        while (imported < LIMIT) {
            try {
                HttpHeaders headers = new HttpHeaders();
headers.add("User-Agent", "Mozilla/5.0");

HttpEntity<String> entity = new HttpEntity<>(headers);

ResponseEntity<String> response =
        restTemplate.exchange(
                String.format(API, page),
                HttpMethod.GET,
                entity,
                String.class
        );

String body = response.getBody();

                if (body == null) {
    System.out.println("NGO API returned NULL response for page " + page);
    break;
}

System.out.println(
        "NGO API PAGE " + page + " RESPONSE: " +
        body.substring(0, Math.min(200, body.length()))
);


                JsonNode root = mapper.readTree(body);
                JsonNode data = root.get("data");

               


                if (data == null || !data.isArray() || data.size() == 0)
                    break;

                for (JsonNode ngo : data) {
                    if(imported >= LIMIT) break;

                    String id = ngo.get("ngo_reg_no").asText();

                    DirectoryProfile profile =
                            repo.findByExternalId(id).orElse(new DirectoryProfile());

                    profile.setExternalId(id);
                    profile.setName(ngo.get("ngo_name").asText(""));
                    profile.setType("NGO");
                    profile.setEmail(ngo.get("ngo_email").asText(""));
                    profile.setState(ngo.get("state_name").asText(""));

                    repo.save(profile);
                    imported++;
                }

                page++;

            } catch (Exception ex) {
                ex.printStackTrace();
                break;
            }
        }

        return imported;
    }
}
