import SettingsForm from "@/components/forms/SettingsForm";

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Website Settings</h1>
            <SettingsForm />
        </div>
    );
}
