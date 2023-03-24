# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Based on the ticket provided, I would break this down into the following individual tickets:

### Ticket 1: Add Custom ID for Agents
**Description:** Modify the `Agents` table to include a new column named `facility_agent_id`. Allow Facilities to set this custom ID for each Agent. Modify the Shifts table to include a reference to the "facility_agent_id" of the Agent assigned to each shift. Modify the `generateReport` function to use the `facility_agent_id` instead of the internal database id when generating reports.

**Acceptance Criteria:**
* A new column `facility_agent_id` is added to the `Agents` table.
* Facilities are able to set a custom `facility_agent_id` for each Agent they work with.
* `Shifts` table is modified to include a reference to the `facility_agent_id` of the Agent assigned to each shift.
* `generateReport` function is modified to use the `facility_agent_id` instead of the internal database id when generating reports.

**Time/Effort Estimate:** 1 hou

```Gherkin
Feature: Custom IDs for Agents
  As a Facility user of the platform
  I want to be able to save custom ids for Agents
  So that I can use them on reports

  Scenario: Saving a custom id for an Agent
    Given I am logged in as a Facility user
    And I am on the "Edit Agent" page
    When I enter a custom id for the Agent
    And I click the "Save" button
    Then the custom id is saved for the Agent

  Scenario: Viewing the custom id for an Agent on a report
    Given I am logged in as a Facility user
    And I am viewing a report for a given quarter
    When I look at the Agent section of the report
    Then I see the custom id for each Agent next to their name

```

### Ticket 2: Update `getShiftsByFacility` function
**Description:* Modify the `getShiftsByFacility` function to include the `facility_agent_id` of the Agent assigned to each shift in the metadata returned.

**Acceptance Criteria:**
* The `getShiftsByFacility` function includes the `facility_agent_id` of the Agent assigned to each shift in the metadata returned.

**Time/Effort Estimate:** 1 hour

```Gherkin
Feature: Custom IDs on Reports
  As a Facility user of the platform
  I want reports to show custom ids for Agents
  So that I can easily identify the Agents I work with

  Scenario: Generating a report using custom ids
    Given I am logged in as a Facility user
    And I am on the "Generate Report" page
    When I select a quarter
    And I select the option to use custom ids
    And I click the "Generate Report" button
    Then a PDF report is generated using custom ids for Agents
```

### Ticket 3: Validate Facility Agent IDs
**Description:** Add validation to ensure that each `facility_agent_id` entered by the Facility is unique.

**Acceptance Criteria:**
* Facilities are not able to set a `facility_agent_id` that already exists in the database for another Agent.
* An error message is returned to the Facility if they try to set a `facility_agent_id` that already exists in the database.

**Time/Effort Estimate:** 4 hours

```Gherkin
Feature: Add custom ID for Agents in the report generation feature
  
  Scenario: Facility can save custom IDs for Agents
    Given a Facility is logged in to the system
    When the Facility saves a custom ID for an Agent
    Then the custom ID is associated with the Agent in the database
    
  Scenario: Facility can use custom IDs in generated reports
    Given a Facility is logged in to the system
    And the Facility has saved custom IDs for Agents
    When the Facility generates a report for a quarter
    Then the report displays custom IDs instead of internal database IDs for the assigned Agents
    
  Scenario: Facility can edit custom IDs
    Given a Facility is logged in to the system
    And the Facility has saved custom IDs for Agents
    When the Facility edits a custom ID for an Agent
    Then the updated custom ID is associated with the Agent in the database
    
  Scenario: Facility can delete custom IDs
    Given a Facility is logged in to the system
    And the Facility has saved custom IDs for Agents
    When the Facility deletes a custom ID for an Agent
    Then the internal database ID is used for the Agent in generated reports
  
  Scenario: Facility cannot save a duplicate custom ID for an Agent
    Given a Facility is logged in to the system
    And there exists a custom ID in the database for an Agent
    When the Facility attempts to save a new custom ID for the same Agent
    Then an error message is displayed stating that the custom ID already exists in the database
```