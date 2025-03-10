import React from 'react';
import {
  Page,
  Form,
  FormLayout,
  TextField,
  Button,
  Card,
  Layout,
  LegacyStack as Stack,
  Text,
  Box,
  BlockStack
} from '@shopify/polaris';
import { useProjectStore } from '../store/projectStore';
import { Project, ProjectMember } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

const ProjectsPage: React.FC = () => {
  const { 
    currentProject, 
    formState, 
    addProject, 
    updateProject, 
    updateFormState 
  } = useProjectStore();

  const handleSubmit = () => {
    const project: Project = {
      id: currentProject?.id || uuidv4(),
      ...formState
    };

    if (currentProject) {
      updateProject(project);
    } else {
      addProject(project);
    }
  };

  const addMember = () => {
    const newMember = { id: uuidv4(), name: '', role: '' };
    updateFormState({ 
      members: [...formState.members, newMember]
    });
  };

  const updateMember = (id: string, field: keyof ProjectMember, value: string) => {
    const updatedMembers = formState.members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    );
    updateFormState({ members: updatedMembers });
  };

  return (
    <Page title="Project Management">
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="400">
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    label="Project Name"
                    value={formState.name}
                    onChange={(value) => updateFormState({ name: value })}
                    autoComplete="off"
                  />

                  <TextField
                    label="Description"
                    value={formState.description}
                    onChange={(value) => updateFormState({ description: value })}
                    multiline={4}
                    autoComplete="off"
                  />

                  <FormLayout.Group>
                    <TextField
                      type="date"
                      label="Start Date"
                      value={formState.startDate}
                      onChange={(value) => updateFormState({ startDate: value })}
                      autoComplete="off"
                    />
                    <TextField
                      type="date"
                      label="End Date"
                      value={formState.endDate}
                      onChange={(value) => updateFormState({ endDate: value })}
                      autoComplete="off"
                    />
                  </FormLayout.Group>

                  <Box paddingBlockStart="400">
                    <BlockStack gap="400">
                      <Text variant="headingMd" as="h3">Project Members</Text>
                      {formState.members.map(member => (
                        <FormLayout.Group key={member.id}>
                          <TextField
                            label="Name"
                            value={member.name}
                            onChange={(value) => updateMember(member.id, 'name', value)}
                            autoComplete="off"
                          />
                          <TextField
                            label="Role"
                            value={member.role}
                            onChange={(value) => updateMember(member.id, 'role', value)}
                            autoComplete="off"
                          />
                        </FormLayout.Group>
                      ))}
                      <Button onClick={addMember}>Add Member</Button>
                    </BlockStack>
                  </Box>

                  <Button variant="primary" submit>
                    {currentProject ? 'Update Project' : 'Create Project'}
                  </Button>
                </FormLayout>
              </Form>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProjectsPage; 