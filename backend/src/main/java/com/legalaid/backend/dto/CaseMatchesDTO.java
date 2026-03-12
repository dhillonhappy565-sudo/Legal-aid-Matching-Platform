package com.legalaid.backend.dto;

import java.util.List;

public class CaseMatchesDTO {
    public Long caseId;
    public String caseTitle;
    public String caseStatus;
    public List<MatchItemDTO> matches;
}
