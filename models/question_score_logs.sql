CREATE TABLE IF NOT EXISTS question_score_logs (
    id BIGSERIAL PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    instance_question_id BIGINT NOT NULL REFERENCES instance_questions ON DELETE CASCADE ON UPDATE CASCADE,
    auth_user_id BIGINT REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    points DOUBLE PRECISION,
    max_points DOUBLE PRECISION,
    score_perc DOUBLE PRECISION
);

CREATE INDEX IF NOT EXISTS question_score_logs_instance_question_id_idx ON question_score_logs (instance_question_id);
